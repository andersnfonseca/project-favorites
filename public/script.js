const ul = document.querySelector('ul')
const input = document.querySelector('input')
const form = document.querySelector('form')


async function load() {
    const response = await fetch('http://localhost:3000/')
        .then(data => data.json())
    response.urls.map(({ name, url, _id }) => addElement(name, url, _id))
}

load()

function addElement(name, url, _id) {

    const li = document.createElement('li')
    const a = document.createElement("a")
    const trash = document.createElement("span")
    const edit = document.createElement("span")

    a.href = url
    a.innerHTML = name
    a.target = "_blank"

    edit.innerHTML = `<button onclick="removeElement()"><i class="fas fa-edit"></i></button>`
    trash.innerHTML = `<button onclick="removeElement()"><i class="fa-solid fa-trash"></i></button>`

    edit.onclick = () => editElement(edit, { name, url, _id })
    trash.onclick = () => removeElement(trash, { name, url, _id })

    ul.append(li)
    li.append(a)
    li.append(edit)
    li.append(trash)

}

async function addElementAndSendToApi({ name, url }) {

    addElement({ name, url })

    const response = await fetch('http://localhost:3000', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            url: url
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    window.location.reload()
    if (!response.ok)
        console.error(`Erro ao enviar os dados para a API: ${response.statusText}`)

}

// async function editElement({ name, url }) {
    
//     fetch('http://localhost:3000', {
//         method: 'PATCH',
//         body: JSON.stringify({
//             name: name,
//             url: url
//         }),
//         headers: {
//             'Content-type': 'application/json',
//         },
//     })

// }

async function removeElement(element, { name, url, _id }) {
    if (confirm('Tem certeza que deseja deletar?')) {

        const response = await fetch(`http://localhost:3000/${_id}`, { method: "DELETE" })

        element.parentNode.remove()

        if (!response.ok)
            console.error(`Erro ao enviar os dados para a API: ${response.statusText}`)
    }

}


form.addEventListener('submit', (event) => {

    event.preventDefault();

    let { value } = input

    if (!value)
        return alert('Preencha o campo!')

    const [name, url] = value.split(',')

    if (!url)
        return alert('O texto não está formatado da maneira correta.')

    if (!/^http/.test(url))
        return alert('Digite a url da maneira correta.')

    addElementAndSendToApi({ name, url })

    input.value = ''

})