const express = require('express');
const router = express.Router();
const Incident = require('../../Incident/models/Incident');
const { jwtAuthMiddleware } = require('../../jwt');
const rbac = require('../../rbac');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// 🔧 Utility to generate CSV
const exportToCSV = (data) => {
  const fields = ['title', 'priority', 'status', 'createdAt', 'slaHours'];
  const parser = new Parser({ fields });
  return parser.parse(data);
};

// 🔧 Utility to generate PDF
const exportToPDF = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.fontSize(16).text('Incident Report', { align: 'center' });
    doc.moveDown();

    data.forEach((incident) => {
      doc
        .fontSize(12)
        .text(`Title: ${incident.title}`)
        .text(`Status: ${incident.status}`)
        .text(`Priority: ${incident.priority}`)
        .text(`Created: ${new Date(incident.createdAt).toLocaleString()}`)
        .moveDown();
    });

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdf = Buffer.concat(buffers);
      resolve(pdf);
    });

    doc.end();
  });
};

// 📄 GET /reports/incidents - generate report
router.get('/incidents', jwtAuthMiddleware, rbac(['admin', 'engineer']), async (req, res) => {
  try {
    const { status, priority, startDate, endDate, format } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const incidents = await Incident.find(query).lean();

    if (format === 'csv') {
      const csv = exportToCSV(incidents);
      res.setHeader('Content-Disposition', 'attachment; filename=incident-report.csv');
      res.setHeader('Content-Type', 'text/csv');
      return res.send(csv);
    }

    if (format === 'pdf') {
      const pdfBuffer = await exportToPDF(incidents);
      res.setHeader('Content-Disposition', 'attachment; filename=incident-report.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(pdfBuffer);
    }

    return res.status(400).json({ error: 'Invalid or missing format. Use ?format=csv or pdf' });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
