const express=require('express');
const router=express.Router();
const Incident=require('../../Incident/models/Incident');
const {jwtAuthMiddleware}=require('../../jwt');
const rbac=require('../../rbac');


// 🔼 GET escalated incidents (e.g., status = 'escalated')
router.get('/', jwtAuthMiddleware, rbac(['admin', 'engineer']), async (req, res) => {
  try {
    const escalatedIncidents = await Incident.find({ status: 'escalated' });
    res.status(200).json(escalatedIncidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔼 POST manual escalation
router.post('/manual', jwtAuthMiddleware, rbac(['admin']), async (req, res) => {
  const { id } = req.body;

  try {
    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      { status: 'escalated' },
      { new: true }
    );

    if (!updatedIncident) return res.status(404).json({ error: 'Incident not found' });

    res.status(200).json({ message: 'Incident escalated manually', updatedIncident });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;