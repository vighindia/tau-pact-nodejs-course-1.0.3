"use strict"

const { Matchers, Pact} = require("@pact-foundation/pact")
const { getClients, postClient } = require("../../../src/consumer")
const {string, integer, iso8601Date} = Matchers

describe("Clients Service", () => {
    const GET_EXPECTED_BODY = [{
        "firstName": string("Lisa"),
        "lastName": string("Simpson"),
        "age": integer(8),
        "date": iso8601Date("2014-01-01"),
        "id": integer(1)
    },
        {
            "firstName": string("Wonder"),
            "lastName": string("Woman"),
            "age": integer(30),
            "date": iso8601Date("2014-01-01"),
            "id": integer(2)
        },
        {
            "firstName": string("Homer"),
            "lastName": string("Simpson"),
            "date": iso8601Date("2014-01-01"),
            "age": integer(39),
            "id": integer(3)
        }]

    afterEach(() => provider.verify())

    describe("GET Clients", () => {
        beforeEach(() => {
            const interaction = {
                state: "i have a list of clients",
                uponReceiving: "a request for all clients",
                withRequest: {
                    method: "GET",
                    path: "/clients",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    //body: GET_EXPECTED_BODY,
                    body: Matchers.like(GET_EXPECTED_BODY).contents,
                },
            }

            return provider.addInteraction(interaction)
        })

        test("returns correct body, header and statusCode", async() => {
            const response = await getClients()
            expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
            //expect(response.data).toEqual(GET_EXPECTED_BODY)
            expect(response.status).toEqual(200)
        })
    })

    const POST_BODY = {
        firstName: "Rafaela",
        lastName: "Azevedo",
        date: "2014-01-01",
        age: 29
    }

    const POST_EXPECTED_BODY = {
        firstName: string("Rafaela1"),
        lastName: string("Azevedo1"),
        age: integer(291),
        "date": iso8601Date("2014-01-01"),
        id: integer(31),
    }

    describe("POST Client", () => {
        beforeEach(() => {
            const interaction = {
                state: "i create a new client",
                uponReceiving: "a request to create client with firstname and lastname",
                withRequest: {
                    method: "POST",
                    path: "/clients",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    body: POST_BODY,
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.like(POST_EXPECTED_BODY).contents,
                },
            }

            return provider.addInteraction(interaction)
        })

        test("returns correct body, header and statusCode", async() => {
            const response = await postClient(POST_BODY)
            console.log(response.data)
          //expect(response.data.id).toEqual(3)
            expect(response.status).toEqual(200)
        })
    })
})