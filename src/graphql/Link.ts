import { extendType, nonNull, objectType, stringArg, intArg, arg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("description");
        t.nonNull.string("url");
        t.field("postedBy", {   // 1
            type: "User",
            resolve(parent, args, context) {  // 2
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
    }
})

let links: NexusGenObjects["Link"][] = [
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
]

export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            resolve(parent, args, context, info) {
                return context.prisma.link.findMany();
            }
        })
    }
})

export const LinkMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link",
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                const {description, url} = args;

                const newLink = context.prisma.link.create({
                    data: {
                        description: description,
                        url: url
                    }
                });
                
                return newLink;
            }
        })

        t.nonNull.field('deletePost', {
            type: "GenericMessage",
            args: {
                id: nonNull(intArg())
            },
            resolve(parent, args, context) {
                const { id } = args;
                links = links.filter(item => item.id !== id);
                return {
                    status: 200,
                    message: 'Berhasil dihapus'
                }
            }
        })
    }
})
