let person = {
    role: "admin",
    experience: 3,
    active: false,
    department: "Finance"
};

person.department = prompt("Enter Your Department: ");
let msg = person.role === "admin" ? (person.experience > 5 && person.department === "IT" && person.active == true ? "Full IT Admin Access" :
    person.experience > 5 && person.department !== "IT" && person.active == true ? "Full General Admin Access" :
        person.experience <= 5 && person.active ? "Limted Admin Access" :
            "Admin Access Revoked") :
    person.role === "manager" ? (person.experience > 3 && person.active == true && person.department === "Sales" ? "Full Sales Manager Access" :
        person.experience > 3 && person.active == true && person.department !== "Sales" ? "Full Manager Access" :
            person.experience <= 3 && person.active == true ? "Limited Access Granted" :
                "Manager Access Revoked") :
        person.role === "user" ? (person.active == true && person.department === "Support" ? "Priority Support Access" :
            person.active == true && person.department !== "Suppprt" ? "User Access" :
                "User Access Revoked") :
            "Invalid Role";

console.log(msg);