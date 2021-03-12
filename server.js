const express = require("express");
const app = express();
const port = 3000;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const options = {
  swaggerDefinition: {
    info: {
      title: "database API",
      version: "1.0.0",
      description: "swagger description for api",
    },
    host: "198.211.108.141:3000",
    basePath: "/",
  },
  apis: ["./server/server.js"],
};
const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sample",
  port: 3306,
  connectionLimit: 5,
});

app.get("/", (req, res) => {
  res.send(`hello! navigate to /docs for swagger ui documentation`);
});

/**
 * @swagger
 * /api/v1/agents:
 *    get:
 *      description: Return all agents
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Returns an array of objects of each agent
 */
app.get("/api/v1/agents", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM agents")
        .then((rows) => {
          res.send(rows);
        })
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          //handle error
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      //not connected
    });
});

/**
 * @swagger
 * /api/v1/companies:
 *    get:
 *      description: Return all companies
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Return an array of objects of each company
 */
app.get("/api/v1/companies", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM company")
        .then((rows) => {
          res.send(rows);
        })
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          //handle error
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      //not connected
    });
});

/**
 * @swagger
 * /api/v1/companies/{id}:
 *    get:
 *      description: Return one company
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Return a company based on company id
 */
app.get("/api/v1/companies/:id", (req, res) => {
  console.log(req.params.id);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(`SELECT * FROM company WHERE COMPANY_ID='${req.params.id}'`)
        .then((rows) => {
          res.send(rows);
        })
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          //handle error
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      //not connected
    });
});

/**
 * @swagger
 * /api/v1/companies/{id}:
 *    delete:
 *      description: Delete one company
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Successfully deleted record from table
 */
app.delete("/api/v1/companies/:id", (req, res) => {
  console.log(req.params.id);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(`DELETE FROM company WHERE COMPANY_ID='${req.params.id}'`)
        .then((rows) => {
          res.send(rows);
        })
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          //handle error
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      //not connected
    });
});

/**
 * @swagger
 * /api/v1/companies/{id}:
 *    patch:
 *      description: Update record partially to company table
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: company
 *            description: company object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Company'
 *          - name: id
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Updated data to company table
 */
app.patch("/api/v1/companies/:id", (req, res) => {
  console.log(req.params.id);
  const { name, city } = req.body;
  pool
    .getConnection()
    .then((conn) => {
      if (name && city) {
        conn
          .query(
            `UPDATE company SET COMPANY_NAME='${name}', COMPANY_CITY='${city}' WHERE COMPANY_ID='${req.params.id}'`
          )
          .then((rows) => {
            res.send(rows);
          })
          .then((res) => {
            console.log(res);
            conn.end();
          })
          .catch((err) => {
            //handle error
            console.log(err);
            conn.end();
          });
      } else if (name) {
        conn
          .query(
            `UPDATE company SET COMPANY_NAME='${name}' WHERE COMPANY_ID='${req.params.id}'`
          )
          .then((rows) => {
            res.send(rows);
          })
          .then((res) => {
            console.log(res);
            conn.end();
          })
          .catch((err) => {
            //handle error
            console.log(err);
            conn.end();
          });
      } else if (city) {
        conn
          .query(
            `UPDATE company SET COMPANY_CITY='${city}' WHERE COMPANY_ID='${req.params.id}'`
          )
          .then((rows) => {
            res.send(rows);
          })
          .then((res) => {
            console.log(res);
            conn.end();
          })
          .catch((err) => {
            //handle error
            console.log(err);
            conn.end();
          });
      } else {
        res.status(400).json({ error: "Enter values to update" });
      }
    })
    .catch((err) => {
      //not connected
    });
});

/**
 * @swagger
 * definitions:
 *   Company1:
 *     properties:
 *       COMPANY_ID:
 *         type: string
 *       COMPANY_NAME:
 *         type: string
 *       COMPANY_CITY:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/companies/:
 *    post:
 *      description: Add one company
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Company
 *            description: Company object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Company1'
 *      responses:
 *          200:
 *              description: Add a company
 *          400:
 *              description: Error from parameters
 *          500:
 *              description: Server Error
 */
app.post("/api/v1/companies", (req, res) => {
  console.log(req.params.id);
  const { COMPANY_ID, COMPANY_NAME, COMPANY_CITY } = req.body;

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          `INSERT INTO company (COMPANY_ID, COMPANY_NAME, COMPANY_CITY) VALUES ('${COMPANY_ID}', '${COMPANY_NAME}', '${COMPANY_CITY}')`
        )
        .then((rows) => {
          res.send(rows);
        })
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          //handle error
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      //not connected
      res.status(500).send("Server Error");
    });
});
/**
 * @swagger
 * /api/v1/companies/{id}:
 *    put:
 *      description: Update one company
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Company
 *            description: Company object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Company'
 *          - name: id
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Update a company based on company id
 */
app.put("/api/v1/companies/:id", (req, res) => {
  console.log(req.params.id);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          `UPDATE company SET COMPANY_NAME='${req.body.name}', COMPANY_CITY='${req.body.city}' WHERE COMPANY_ID='${req.params.id}'`
        )
        .then((rows) => {
          res.send(rows);
        })
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          //handle error
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      //not connected
    });
});

/**
 * @swagger
 * definitions:
 *   Company:
 *     properties:
 *       name:
 *         type: string
 *       city:
 *         type: string
 */
/**

/**
 * @swagger
 * /api/v1/customers:
 *    get:
 *      description: Return all customers
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Return an array of objects of each customer
 */

app.get("/api/v1/customers", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM customer")
        .then((rows) => {
          res.send(rows);
        })
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          //handle error
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      //not connected
    });
});

/**
 * @swagger
 * /api/v1/customer/{id}:
 *    get:
 *      description: Return one company
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Return a company based on company id
 */
app.get("/api/v1/customer/:id", (req, res) => {
  console.log(req.params.id);
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(`SELECT * FROM customer WHERE CUST_CODE='${req.params.id}'`)
        .then((rows) => {
          res.send(rows);
        })
        .then((res) => {
          console.log(res);
          conn.end();
        })
        .catch((err) => {
          //handle error
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      //not connected
    });
});

app.get("/say", async (req, res) => {
  if (!req.query || !req.query.keyword) {
    res.status(400).send("Provide valid parameters");
  } else {
    await axios
      .get(
        "https://hvlyvvxt24.execute-api.us-east-2.amazonaws.com/default/myFunction?keyword=" +
          req.query.keyword
      )
      .then(function (val) {
        res.status(200).send(val.data);
      });
  }
});

app.listen(port, () => {
  console.log(`we are listening on localhost port ${port}`);
});
