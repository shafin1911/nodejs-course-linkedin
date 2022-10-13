var request = require("request")

describe("calc", () => {
  it("should multiply 2 and 2", () => {
    expect(2 * 2).toBe(4)
  })
})

describe("get messages", () => {
  it("should return 200 ok", (done) => {
    request.get("http://localhost:3000/messages", (err, res) => {
      expect(res.statusCode).toEqual(200)
      done()
    })
  })
})

describe("get messages from a user", () => {
  it("should return 200 ok", (done) => {
    request.get("http://localhost:3000/messages/asd", (err, res) => {
      expect(res.statusCode).toEqual(200)
      done()
    })
  })

  it("name should be tim", (done) => {
    request.get("http://localhost:3000/messages/asd", (err, res) => {
      expect(JSON.parse(res.body)[0].name).toEqual("asd")
      done()
    })
  })
})
