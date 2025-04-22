fetch("https://jsonplaceholder.typicode.com/users").then(response => response.json).then(data =>
{
    const filtered = data.filter(user => user.name.length > 15).map(user +user.email).reduce((acc, email, index, array) =>{
        return acc + email + (index < array.length - 1 ? '|' : '');
    }, '')
    console.log(filtered)
}
)
