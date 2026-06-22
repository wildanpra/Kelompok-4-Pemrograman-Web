"use strict";
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["New"] = "new";
    LeadStatus["Contacted"] = "contacted";
    LeadStatus["Qualified"] = "qualified";
    LeadStatus["Lost"] = "lost";
})(LeadStatus || (LeadStatus = {}));
var DealStage;
(function (DealStage) {
    DealStage["Proposal"] = "proposal";
    DealStage["Negotiation"] = "negotiation";
    DealStage["Won"] = "Won";
    DealStage["Lost"] = "lost";
})(DealStage || (DealStage = {}));
function updateLeadStatus(lead, newStatus) {
    lead.status = newStatus;
    console.log(`Status Lead ${lead.id} diubah menjadi ${newStatus}`);
}
const myLead = { id: 1, status: LeadStatus.New };
updateLeadStatus(myLead, LeadStatus.Qualified);
