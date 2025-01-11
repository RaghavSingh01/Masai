let user = {
    name: "Bob", 
    role: "user",
    active: true
};

let usermsg = user.role === "admin" && user.active == true ? "Admin Access Granted!" :
    user.role === "admin" && user.active == false ? "Admin Access Revoked!" :
        user.role === "user" && user.active == true ? "User Access Granted!" :
            user.role === "user" && user.active == false ? "User Access Revoked!" :
                "Access Denied";

console.log(usermsg);