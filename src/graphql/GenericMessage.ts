import { objectType } from "nexus";

export const GenericMessage = objectType({
    name: "GenericMessage",
    definition(t) {
        t.nonNull.int("status");
        t.nonNull.string("message");
    }
})