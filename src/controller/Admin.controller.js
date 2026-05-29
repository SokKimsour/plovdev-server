const { JobListing } = require('../models');

const getJobs = async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        const jobs = await JobListing.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json({ jobs });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const approveJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await JobListing.findByPk(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' }); 
        }

        await job.update({ status: 'published', publishedAt: new Date() });
        return res.status(200).json({ message: 'Job approved successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const rejectJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await JobListing.findByPk(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.update({ status: 'rejected', rejectedAt: new Date() });
        return res.status(200).json({ message: 'Job rejected successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await JobListing.findByPk(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.destroy();
        return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    getJobs,
    approveJob,
    rejectJob,
    deleteJob
};