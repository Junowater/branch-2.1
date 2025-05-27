document.addEventListener('DOMContentLoaded', () => {
    const rotationChartBody = document.getElementById('rotationChartBody');

    // Corrected key names – make sure these match the saving keys exactly
    const centerData = JSON.parse(localStorage.getItem('centerSectionSchedule') || '{}');
    const frontData = JSON.parse(localStorage.getItem('frontLineSchedule') || '{}');
    const rearData = JSON.parse(localStorage.getItem('rearLineSchedule') || '{}');

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
        nameCell.textContent = member;
        row.appendChild(nameCell);

        allQuarters.forEach(quarter => {
            const cell = document.createElement('td');
            let foundInSection = false;

            const checkSchedule = (data) => {
                const quarterData = data[quarter];
                if (quarterData) {
                    for (const station in quarterData) {
                        if (Array.isArray(quarterData[station]) && quarterData[station].includes(member)) {
                            cell.textContent = station;
                            foundInSection = true;
                            return;
                        }
                    }
                }
            };

            checkSchedule(centerData);
            if (!foundInSection) checkSchedule(frontData);
            if (!foundInSection) checkSchedule(rearData);

            if (!foundInSection) {
                cell.textContent = "-";
            }

            row.appendChild(cell);
        });

        rotationChartBody.appendChild(row);
    });
});
