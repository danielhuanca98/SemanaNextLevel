const express = require("express")
const server = express()

//pegar o bancos de dados
const db = require("./database/db")


//configurar pasta pública
server.use(express.static("public"))

//Habilitar o uso do req.body no uso da nossa aplicação
server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos da aplicação

//página inicial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título" })
})

server.get("/create-point", (req, res) => {

    //req.query: Query Strings da nossa url
    //console.log(req.query)


    return res.render("create-point.html")
})


server.post("/savepoint", (req, res) => {

    // req.body: O corpo do nosso formulário
    //console.log(req.body)

    //Inserir dados no banco de dados
        const query = `
        INSERT INTO places (
            image, 
            name, 
           address,
           address2,
           state,
           city,
           items
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
        `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]
  
    function afterInsertData(err) {
       if(err) {
           console.Console(err)
           return res.send("Erro no cadastro")
       }
       
       return res.render("create-point.html", { saved: true })
    }
    db.run(query, values, afterInsertData)

})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        //Pesquisa vazia
        return res.render("search-results.html", { total: 0 })

    }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.Console(err)
        }

        console.log("Aqui estão seus regsitros: ")
        console.log(rows)
        const total = rows.length

        //mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total })

    })

})

//ligar o servidor

server.listen(3000)