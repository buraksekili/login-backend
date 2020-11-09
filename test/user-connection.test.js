const { signup, deleteUser } = require("../src/db");
const app = require("../src");
const request = require("supertest");
const axios = require("axios");

let testUser = {
  mail: "king@james.king23",
  password: "baba",
};

beforeEach(async () => {
  const [error] = await signup(testUser.mail, testUser.password);
  if (error) {
    console.debug("error in creating user", error);
  }
});

afterEach(async () => {
  const [error] = await deleteUser(testUser.mail);
  if (error) {
    console.debug("testuser deletion error", error);
  }
});

describe("User connection operations", () => {
  it("should login", async function (done) {
    const data = JSON.stringify([testUser]);

    const config = {
      method: "post",
      url: "http://localhost:3000/login",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    };
    try {
      const result = await axios(config);

      expect(result.status).toEqual(200);
      expect(typeof result.data).toBe("object");
      expect(result.data.hasOwnProperty("auth")).toBe(true);
      expect(result.data.hasOwnProperty("user_id")).toBe(true);
      expect(result.data.hasOwnProperty("user_mail")).toBe(true);
      expect(result.data.user_mail).toEqual(testUser.mail);
      expect(result.data.auth).toEqual(true);
      done();
    } catch (error) {
      done(error);
    }
  });

  it("shouldn't login for wrong credential.", async function (done) {
    const data = [
      { mail: testUser.mail + testUser.mail, password: testUser.password },
    ];

    try {
      await request(app).post("/login").send(data).expect(401, {
        auth: false,
        error: "Invalid credentials",
      });
      done();
    } catch (error) {
      done(error);
    }
  });

  it("should give invalid request body error", async function (done) {
    const data = [];

    try {
      await request(app).post("/login").send(data).expect(401, {
        error: "Invalid request body.",
      });
      done();
    } catch (error) {
      done(error);
    }
  });

  it("should give invalid request body error", async function (done) {
    const data = undefined;

    try {
      await request(app).post("/login").send(data).expect(401, {
        error: "Invalid request body.",
      });
      done();
    } catch (error) {
      done(error);
    }
  });

  it("should give bind parameter error ", async function (done) {
    const data = [{}];

    try {
      await request(app).post("/login").send(data).expect(401, {
        auth: false,
        error:
          "Bind parameters must not contain undefined. To pass SQL NULL specify JS null",
      });
      done();
    } catch (error) {
      done(error);
    }
  });

  it("should signup", function (done) {
    const data = [{ mail: "wi@l.be@created", password: "lol" }];
    request(app)
      .post("/signup")
      .send(data)
      .expect(200, {
        status: true,
        message: `wi@l.be@created is created`,
      })
      .end(async (err, res) => {
        if (err) return done(err);
        await deleteUser("wi@l.be@created");
        done();
      });
  });

  it("should give me invalid request body", function (done) {
    request(app)
      .post("/signup")
      .send([])
      .expect(401, {
        error: "Invalid request body.",
      })
      .end(async (err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should give me parameters error", function (done) {
    request(app)
      .post("/signup")
      .send([{}])
      .expect(400, {
        error:
          "Bind parameters must not contain undefined. To pass SQL NULL specify JS null",
        status: false,
      })
      .end(async (err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
