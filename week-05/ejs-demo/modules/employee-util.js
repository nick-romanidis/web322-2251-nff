const employees = [
    {
        name: 'John',
        age: 23,
        occupation: 'Developer',
        company: 'Scotiabank',
        visible: true,
        imageUrl: "man1.jpg"
    },
    {
        name: 'Frank',
        age: 40,
        occupation: 'Manager',
        company: 'RBC',
        visible: false,
        imageUrl: "man3.jpg"
    },
    {
        name: 'Jane',
        age: 23,
        occupation: 'Manager',
        company: 'RBC',
        visible: true,
        imageUrl: "woman1.jpg"
    }
];

module.exports.getAllEmployees = function () {
    return employees;
};

module.exports.getVisibleEmployees = function () {
    let filtered = [];

    for (let i = 0; i < employees.length; i++) {
        if (employees[i].visible) {
            filtered.push(employees[i]);
        }
    }

    return filtered;
}

module.exports.getEmployeeByCompany = function (employees) {
    return employees;
}