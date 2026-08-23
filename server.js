
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================
   CONFIGURAÇÕES
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/* =========================
   PASTA DE COMPROVANTES
========================= */

const pastaUploads = path.join(
    __dirname,
    "uploads"
);


if (!fs.existsSync(pastaUploads)) {

    fs.mkdirSync(
        pastaUploads,
        {
            recursive: true
        }
    );

}


/* =========================
   CONFIGURAÇÃO DO UPLOAD
========================= */

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            pastaUploads
        );

    },


    filename: function (
        req,
        file,
        cb
    ) {

        const nomeSeguro =
            Date.now() +
            "-" +
            file.originalname
                .replace(/[^a-zA-Z0-9.-]/g, "_");


        cb(
            null,
            nomeSeguro
        );

    }

});


const upload = multer({

    storage: storage,

    limits: {

        fileSize:
            10 * 1024 * 1024

    },

    fileFilter:
        function (
            req,
            file,
            cb
        ) {

            const extensoesPermitidas = [
                ".jpg",
                ".jpeg",
                ".png",
                ".webp",
                ".pdf"
            ];


            const extensao =
                path.extname(
                    file.originalname
                ).toLowerCase();


            if (
                extensoesPermitidas
                    .includes(extensao)
            ) {

                cb(
                    null,
                    true
                );

            } else {

                cb(
                    new Error(
                        "Tipo de arquivo não permitido."
                    )
                );

            }

        }

});


/* =========================
   TESTE DO SERVIDOR
========================= */

app.get(
    "/",
    function (
        req,
        res
    ) {

        res.json({

            sucesso: true,

            mensagem:
                "Backend da Central+ funcionando!"

        });

    }
);


/* =========================
   ENVIO DO COMPROVANTE
========================= */

app.post(

    "/api/comprovante",

    upload.single(
        "comprovante"
    ),

    function (
        req,
        res
    ) {

        if (!req.file) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Nenhum comprovante foi enviado."

            });

        }


        const nomeCliente =
            req.body.nome || "Cliente";


        const mensagem =
            req.body.mensagem || "";


        console.log(
            "Novo comprovante recebido:"
        );


        console.log({
            cliente:
                nomeCliente,

            mensagem:
                mensagem,

            arquivo:
                req.file.filename
        });


        res.json({

            sucesso: true,

            mensagem:
                "Comprovante recebido com sucesso!",

            arquivo:
                req.file.filename

        });

    }

);


/* =========================
   MENSAGENS DO CHAT
========================= */

app.post(

    "/api/mensagem",

    function (
        req,
        res
    ) {

        const nome =
            req.body.nome || "Cliente";


        const mensagem =
            req.body.mensagem;


        if (!mensagem) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Digite uma mensagem."

            });

        }


        console.log(
            "Nova mensagem:"
        );


        console.log({

            nome:
                nome,

            mensagem:
                mensagem

        });


        res.json({

            sucesso: true,

            mensagem:
                "Mensagem recebida!"

        });

    }

);


/* =========================
   ERROS DE UPLOAD
========================= */

app.use(

    function (
        err,
        req,
        res,
        next
    ) {

        console.error(err);


        res.status(400).json({

            sucesso: false,

            mensagem:
                err.message ||
                "Erro no servidor."

        });

    }

);


/* =========================
   INICIAR SERVIDOR
========================= */

app.listen(

    PORT,

    function () {

        console.log(
            `Central+ backend rodando na porta ${PORT}`
        );

    }

);
