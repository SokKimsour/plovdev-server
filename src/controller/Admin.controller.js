const {jobListings} = require('../models');

const approveJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await jobListings.findByPk(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' }); 
        }

        await job.update({ status: 'published', publishedAt: new Date() });
        return res.status(200).json({ message: 'Job approved successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const rejectJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await jobListings.findByPk(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.update({ status: 'rejected', rejectedAt: new Date() });
        return res.status(200).json({ message: 'Job rejected successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    approveJob,
    rejectJob
};