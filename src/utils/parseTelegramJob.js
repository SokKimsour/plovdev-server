//
//HR FORMAT
//
// Company: Meta Cambodia
// Position: React Developer
// Type: Full-time
// Location: Phnom Penh
// Salary: 500-800
// Skills: React, TypeScript, Node.js
// Description: Looking for a skilled frontend developer.
// Contact: hr@meta.com
// Apply: https://forms.google.com/xyz
// HR Name: Dara Sok


const parseTelegramJob = (jobText) => {
    const extract = (label) => {
        const regex = new RegExp(`${label}:\\s*(.+)$`, 'im');
        const match = jobText.match(regex);
        return match ? match[1].trim() : null;
    }

    const salaryRow = extract('Salary');
    let salaryMin = null;
    let salaryMax = null;

    if (salaryRow) {
        const salaryParts = salaryRow.split('-').map(s => parseFloat(s.trim()));
        salaryMin = salaryParts[0] || null;
        salaryMax = salaryParts[1] || null;
    }

    const skillsRaw = extract('Skills');
    const skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()) : [];


    return {
        company_name: extract('Company'),
        title: extract('Position'),
        emp_type: extract('Type'),
        location: extract('Location'),
        salary_min: salaryMin,
        salary_max: salaryMax,
        skills: extract('Skills') ? extract('Skills').split(',').map(s => s.trim()) : null,
        description: extract('Description'),
        contact_email: extract('Contact'),
        apply: extract('Apply'),
        hr_name: extract('HR Name')
    };
}

module.exports = parseTelegramJob;