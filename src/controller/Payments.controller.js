const { sequelize, payments, courses, Users, enrollments, course_progress, sections, lessons, admin_notifications } = require("../models");
const { getReqTime, encodeBase64, buildPurchaseHash, buildCheckTransactionHash } = require("../utils/payment.utils");
const AppError = require("../utils/appError");

// CREATE PAYMENT
const createPayment = async (req, res) => {
    try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await courses.findOne({ where: { id: courseId , status : "published"} });

    if (!course) {
        throw new AppError("Course not found!", 404);
    }

    if (!course.status === "published" ) {
     throw new AppError("Course is not published")
    }

    const user = await Users.findByPk(userId);

    if (!user) {
        throw new AppError("User not found!", 404);
    }

    // find course in payment table for this user
    let payment = await payments.findOne({
        where: { courseId, userId }
    });

    const coursePrice = parseFloat(course.price || 0);

    const calculateCommission = parseFloat((coursePrice * 0.40).toFixed(2));
    const calculateTeacherPayout = parseFloat((coursePrice * 0.60).toFixed(2));

    let transaction_id = `ENR-${Date.now()}`;

    if (payment) {
        if (payment.status === 'APPROVED') {
            throw new AppError("You have already purchased this course", 400);
        }

        // Update pending payment details
        await payment.update({
            transaction_id,
            amount: coursePrice,
            commission: calculateCommission,
            teacherPayout: calculateTeacherPayout
        });
    } else {
        // create payment data to table
        payment = await payments.create({
            amount: coursePrice,
            commission: calculateCommission,
            teacherPayout: calculateTeacherPayout,
            status: "PENDING",
            transaction_id,
            payment_method: "ABA PAYWAY",
            is_refunded: false,
            userId: userId,
            courseId: course.id
        });
    }

    // convert item data to Json Array
    const req_time = getReqTime();
    const paywayItemsJson = JSON.stringify([
        {
            name: course.title_en,
            price: coursePrice.toFixed(2),
            quantity: "1"
        }
    ]);

    // convert items to base64
    const paywayItems = encodeBase64(paywayItemsJson);

    // return data
    const paymentPayload = {
        merchant_id: process.env.ABA_PAYWAY_MERCHANT_ID,
        req_time,
        tran_id: transaction_id,
        amount: coursePrice.toFixed(2),
        items: paywayItems,
        firstname: user.fullName || "NA",
        lastname: user.fullName || "NA",
        email: user.email || "NA@gmail.com",
        phone: user.phoneNumber || "",
        type: "purchase",
        view_type: "popup",
        payment_option: "card",
        shipping: "",
        return_url: "",
        cancel_url: `${process.env.FRONTEND_URL}`,
        continue_success_url: `${process.env.FRONTEND_URL}`,
        currency: "USD",
        payment_gate: 0
    };

    const hash = await buildPurchaseHash(paymentPayload);

    // Create Then Fetch Pattern
    const paymentRecord = await payments.findOne({
        where: { id: payment.id },
        include: [{
            model: courses,
            as: "course"
        }]
    });

    res.status(201).json({
        status: "success",
        message: "Payment initiated successfully",
        data: {
            payment: paymentRecord,
            payway: {
                action: `${process.env.ABA_PAYWAY_BASE_URL}/api/payment-gateway/v1/payments/purchase`,
                method: "POST",
                target: "aba_webservice",
                id: "aba_merchant_request",
                fields: {
                    ...paymentPayload,
                    hash
                }
            }
        }
    });
    } catch (error) {
        res.status(500).json({
            messageError : error.message
        })
    }

};

//  CHECKOUT THE TRASACTION
const  checkoutTransactions = async (req, res) => {
    const { tranId } = req.params;
    const userId = req.user.id
    const payment = await payments.findOne({
        where: { transaction_id: tranId }
    });

    if (!payment) {
        throw new AppError("Payment transaction not found", 404);
    }

    if (payment.userId !== userId) {
        throw new AppError("Access denied! You do not own this payment record", 403);
    }

    const req_time = getReqTime();
    const merchant_id = process.env.ABA_PAYWAY_MERCHANT_ID
    const tran_id = payment.transaction_id

    // hash payload
    const hash = buildCheckTransactionHash({ req_time, merchant_id, tran_id });

    // get payload
    const payload = {
        req_time,
        merchant_id: process.env.ABA_PAYWAY_MERCHANT_ID,
        tran_id: payment.transaction_id,
        hash
    };

    // get the payway url
    const paywayUrl = `${process.env.ABA_PAYWAY_BASE_URL}/api/payment-gateway/v1/payments/check-transaction-2`;

    const response = await fetch(paywayUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...payload,
        })
    });

    if (!response.ok) {
        throw new AppError("Failed to communicate with ABA PayWay API", 502);
    }

    const abaData = await response.json();
    const statusCode = abaData?.status?.code;
    const paymentStatusCode = abaData?.data?.payment_status_code;
    const paymentStatus = abaData?.data?.payment_status;

    if (statusCode === "00") {
        if ((paymentStatusCode === 0 || paymentStatusCode === "00") && paymentStatus === "APPROVED") {
            if (payment.status !== "APPROVED") {
                await sequelize.transaction(async (transaction) => {
                    await payment.update({
                        status: "APPROVED",
                        paid_at: abaData?.data?.transaction_date || new Date()
                    }, { transaction });

                    // Check if enrollment already exists
                    let enrollment = await enrollments.findOne({
                        where: { userId: payment.userId, courseId: payment.courseId },
                        transaction
                    });

                    let created = false;
                    if (!enrollment) {
                        enrollment = await enrollments.create({
                            userId: payment.userId,
                            courseId: payment.courseId,
                            paymentId: payment.id,
                            enrollmentAt: new Date(),
                            isCompleted: false
                        }, { transaction });
                        created = true;
                    }

                    // Set up course progress if enrollment was newly created
                    // count how many lesson for this course 
                    if (created) {
                        const totalLessons = await lessons.count({
                            include: [{
                                model: sections,
                                as: "section",
                                where: { courseId: payment.courseId }
                            }],
                            transaction
                        });

                        // create a course progress for course
                        await course_progress.create({
                            userId: payment.userId,
                            courseId: payment.courseId,
                            total_lessons: totalLessons,
                            completed_lessons: 0,
                            percentage: 0,
                            is_completed: false
                        }, { transaction });
                    }

                    // Create Admin Notification
                    const user = await Users.findByPk(payment.userId, { transaction });
                    const course = await courses.findByPk(payment.courseId, { transaction });

                    await admin_notifications.create({
                        title: "New Student Enrollment",
                        message: `${user?.fullName || "A student"} has enrolled in the course "${course?.title_en || "Course"}"`,
                        is_read: false,
                        userId: payment.userId,
                        courseId: payment.courseId
                    }, { transaction });
                });
            }
        }
        else if (paymentStatus === "DECLINED" || paymentStatus === "CANCELLED" || paymentStatusCode === 3 || paymentStatusCode === 7) {
            await payment.update({ status: paymentStatus || "DECLINED" });
        } else {
            await payment.update({ status: "PENDING" });
        }
    }

    // Create Then Fetch Pattern
    const updatedPayment = await payments.findOne({
        where: { id: payment.id },
        include: [{
            model: courses,
            as: "course"
        }]
    });

    res.status(200).json({
        status: "success",
        message: "Checkout data:",
        data: {
            payment: updatedPayment,
            aba: abaData
        }
    });
};

// HANDLE WEBHOOK NOTIFICATION
const handlePaymentWebhook = async (req, res) => {
    const { tran_id } = req.body;

    if (!tran_id) {
        throw new AppError("Transaction ID is required", 400);
    }

    const payment = await payments.findOne({
        where: { transaction_id: tran_id }
    });

    if (!payment) {
        throw new AppError("Payment transaction not found", 404);
    }

    // If already approved, return OK immediately
    if (payment.status === "APPROVED") {
        return res.status(200).send("OK");
    }

    const req_time = getReqTime();
    const merchant_id = process.env.ABA_PAYWAY_MERCHANT_ID;
    const hash = buildCheckTransactionHash({ req_time, merchant_id, tran_id });

    const payload = {
        req_time,
        merchant_id,
        tran_id,
        hash
    };

    const paywayUrl = `${process.env.ABA_PAYWAY_BASE_URL}/api/payment-gateway/v1/payments/check-transaction-2`;

    const response = await fetch(paywayUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new AppError("Failed to communicate with ABA PayWay API", 502);
    }

    const abaData = await response.json();
    const statusCode = abaData?.status?.code;
    const paymentStatusCode = abaData?.data?.payment_status_code;
    const paymentStatus = abaData?.data?.payment_status;

    if (statusCode === "00") {
        if ((paymentStatusCode === 0 || paymentStatusCode === "00") && paymentStatus === "APPROVED") {
            if (payment.status !== "APPROVED") {
                await sequelize.transaction(async (transaction) => {
                    await payment.update({
                        status: "APPROVED",
                        paid_at: abaData?.data?.transaction_date || new Date()
                    }, { transaction });

                    let enrollment = await enrollments.findOne({
                        where: { userId: payment.userId, courseId: payment.courseId },
                        transaction
                    });

                    let created = false;
                    if (!enrollment) {
                        enrollment = await enrollments.create({
                            userId: payment.userId,
                            courseId: payment.courseId,
                            paymentId: payment.id,
                            enrollmentAt: new Date(),
                            isCompleted: false
                        }, { transaction });
                        created = true;
                    }

                    if (created) {
                        const totalLessons = await lessons.count({
                            include: [{
                                model: sections,
                                as: "section",
                                where: { courseId: payment.courseId }
                            }],
                            transaction
                        });

                        await course_progress.create({
                            userId: payment.userId,
                            courseId: payment.courseId,
                            total_lessons: totalLessons,
                            completed_lessons: 0,
                            percentage: 0,
                            is_completed: false
                        }, { transaction });
                    }

                    // Create Admin Notification
                    const user = await Users.findByPk(payment.userId, { transaction });
                    const course = await courses.findByPk(payment.courseId, { transaction });

                    await admin_notifications.create({
                        title: "New Student Enrollment",
                        message: `${user?.fullName || "A student"} has enrolled in the course "${course?.title_en || "Course"}"`,
                        is_read: false,
                        userId: payment.userId,
                        courseId: payment.courseId
                    }, { transaction });
                });
            }
        }
        else if (paymentStatus === "DECLINED" || paymentStatus === "CANCELLED" || paymentStatusCode === 3 || paymentStatusCode === 7) {
            await payment.update({ status: paymentStatus || "DECLINED" });
        } else {
            await payment.update({ status: "PENDING" });
        }
    }

    res.status(200).send("OK");
};

module.exports = {
    createPayment,
    checkoutTransactions,
    handlePaymentWebhook
};