enum LeadStatus {
  New = "new",
  Contacted = "contacted",
  Qualified = "qualified",
  Lost = "lost",
}

enum DealStage {
  Proposal = "proposal",
  Negotiation = "negotiation",
  Won = "Won",
  Lost = "lost",
}

interface Lead {
  readonly id: number;
  status: LeadStatus;
}

function updateLeadStatus(lead: Lead, newStatus: LeadStatus): void {
  lead.status = newStatus;
  console.log(`Status Lead ${lead.id} diubah menjadi ${newStatus}`);
}

const myLead: Lead = { id: 1, status: LeadStatus.New };

updateLeadStatus(myLead, LeadStatus.Qualified);
