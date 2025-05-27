document.addEventListener('DOMContentLoaded', () => {
    const rotationChartBody = document.getElementById('rotationChartBody');

    // Corrected key names – make sure these match the saving keys exactly
    const centerData = JSON.parse(localStorage.getItem('centerSection_schedule') || '{}');
    const frontData = JSON.parse(localStorage.getItem('frontLine_schedule') || '{}');
    const rearData = JSON.parse(localStorage.getItem('rearLine_schedule') || '{}');

    const allQuarters = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4", "Quarter 5"];
    const teamMembersSet = new Set();

    // Helper function to extract team members from schedules
    const extractMembers = (data) => {
        Object.values(data).forEach(quarterData => {
            Object.values(quarterData).forEach(members => {
                if (Array.isArray(members)) {
                    members.forEach(member => teamMembersSet.add(member));
                }
            });
        });
    };

    extractMembers(centerData);
    extractMembers(frontData);
    extractMembers(rearData);

    const teamMembers = Array.from(teamMembersSet);

    teamMembers.forEach(member => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');

    // Handle both string and object formats
    const memberName = typeof member === 'object' && member !== null
        ? member.name || '[unnamed]'
        : member;

    nameCell.textContent = memberName;
    row.appendChild(nameCell);

    allQuarters.forEach(quarter => {
        const cell = document.createElement('td');
        let assignedStation = "-";

        const findStation = (schedule) => {
            const quarterData = schedule[quarter];
            if (quarterData) {
                for (const station in quarterData) {
                    const members = quarterData[station];
                    if (Array.isArray(members)) {
                        for (const m of members) {
                            const mName = typeof m === 'object' && m !== null ? m.name : m;
                            if (mName === memberName) {
                                return station;
                            }
                        }
                    }
                }
            }
            return null;
        };

        // Check all 3 schedules for this quarter
        assignedStation = findStation(centerData) || findStation(frontData) || findStation(rearData) || "-";
        cell.textContent = assignedStation;
        row.appendChild(cell);
    });

    rotationChartBody.appendChild(row);
});
