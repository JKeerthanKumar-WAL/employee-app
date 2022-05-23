const request = require("supertest");
const app = require("./app");

test("Must get 200 if user is logged in successfully", async () => {
  await request(app)
    .post("/usersql/login")
    .send({
      username: "smith",
      password: "smith",
    })
    .expect(200);
});
test("Must get 200 if the server is running perfectly", async () => {
  await request(app).get("/").expect(200);
});
test("Must get 500 conflit error if department we are trying to add is already exist", async () => {
  await request(app)
    .post("/department")
    .send({
      department: "Sales Executive",
    })
    .expect(500);
});
test("Get all employees request without token, expects 500", async () => {
  await request(app).get("/employee").expect(500);
});
test("Must get 200 if image named null exists in uploads folder", async () => {
  await request(app).get("/uploads/null").expect(200);
});
