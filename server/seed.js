const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const salt = await bcrypt.genSalt(12);

    const adminUser = await User.create({
      email: "admin@blog.com",
      username: "admin",
      password: await bcrypt.hash("admin123", salt),
      isAdmin: true,
    });

    const user1 = await User.create({
      email: "chinee@blog.com",
      username: "chinee",
      password: await bcrypt.hash("user123", salt),
      isAdmin: false,
    });

    const user2 = await User.create({
      email: "juan@blog.com",
      username: "juan_dev",
      password: await bcrypt.hash("user123", salt),
      isAdmin: false,
    });

    console.log("Users created:");
    console.log("  Admin  -> admin@blog.com / admin123");
    console.log("  User 1 -> chinee@blog.com / user123");
    console.log("  User 2 -> juan@blog.com / user123");

    // Create blog posts
    const post1 = await Post.create({
      title: "Getting Started with the MEVN Stack",
      content: `The MEVN stack is a powerful combination of technologies for building full-stack web applications. It consists of MongoDB, Express.js, Vue.js, and Node.js.

MongoDB serves as our NoSQL database, providing flexible document-based storage. Express.js is a minimal web framework for Node.js that handles our API routes and middleware. Vue.js is a progressive JavaScript framework for building user interfaces. Node.js provides the runtime environment for our server-side code.

Together, these technologies allow us to use JavaScript across the entire stack, making development faster and more consistent. In this blog, we'll explore how to build applications using this powerful stack.`,
      author: user1._id,
      createdAt: new Date("2025-06-10"),
    });

    const post2 = await Post.create({
      title: "Understanding JWT Authentication",
      content: `JSON Web Tokens (JWT) are a compact and self-contained way to securely transmit information between parties. In web development, JWTs are commonly used for authentication.

When a user logs in, the server generates a token containing the user's identity and permissions. This token is sent to the client and included in subsequent requests via the Authorization header.

Key benefits of JWT:
- Stateless: No need to store session data on the server
- Scalable: Works well with microservices and distributed systems
- Secure: Tokens are signed and can be encrypted

Always remember to keep your JWT secret key safe and set appropriate expiration times for your tokens.`,
      author: adminUser._id,
      createdAt: new Date("2025-06-12"),
    });

    const post3 = await Post.create({
      title: "Best Practices for RESTful API Design",
      content: `Designing a good REST API is crucial for building maintainable and scalable applications. Here are some best practices to follow:

1. Use proper HTTP methods (GET, POST, PUT, DELETE) for their intended purposes.
2. Return appropriate status codes (200 for success, 201 for created, 404 for not found, etc.).
3. Use consistent naming conventions for your endpoints.
4. Implement proper error handling with meaningful error messages.
5. Add pagination for endpoints that return lists of resources.
6. Version your API to manage breaking changes.
7. Validate input data on the server side.

Following these practices will make your API intuitive for other developers to use and easier to maintain over time.`,
      author: user2._id,
      createdAt: new Date("2025-06-14"),
    });

    const post4 = await Post.create({
      title: "Vue.js 3 Composition API: A Quick Guide",
      content: `Vue.js 3 introduced the Composition API, a new way to organize component logic. Unlike the Options API where logic is split across data, methods, and computed properties, the Composition API lets you group related logic together.

The setup() function is the entry point for using the Composition API. Inside it, you can use reactive references (ref), reactive objects (reactive), computed properties (computed), and lifecycle hooks (onMounted, onUpdated, etc.).

Benefits of the Composition API:
- Better code organization for complex components
- Easier logic reuse through composable functions
- Improved TypeScript support
- More flexible than mixins

The Composition API doesn't replace the Options API — you can use both in the same project depending on your needs.`,
      author: user1._id,
      createdAt: new Date("2025-06-15"),
    });

    const post5 = await Post.create({
      title: "MongoDB Schema Design Tips",
      content: `Designing schemas in MongoDB requires a different mindset compared to relational databases. Here are some tips for effective schema design:

1. Embed data that is accessed together. If you always need a user's address when fetching user data, embed it in the user document.
2. Use references for data that changes independently or is shared across documents.
3. Consider your read/write patterns. Optimize for the most common operations.
4. Use indexes for fields you frequently query or sort by.
5. Avoid deeply nested documents — they can be hard to update and query.

Remember: there's no single "correct" schema design. The best design depends on your application's specific access patterns and requirements.`,
      author: user2._id,
      createdAt: new Date("2025-06-16"),
    });

    console.log("Blog posts created (5 posts)");

    // Create sample comments
    await Comment.create([
      {
        content: "Great introduction! This helped me understand the MEVN stack better.",
        author: user2._id,
        post: post1._id,
        createdAt: new Date("2025-06-11"),
      },
      {
        content: "Thanks for sharing! JWT can be tricky but this explanation is clear.",
        author: user1._id,
        post: post2._id,
        createdAt: new Date("2025-06-13"),
      },
      {
        content: "I always forget about proper status codes. Good reminder!",
        author: adminUser._id,
        post: post3._id,
        createdAt: new Date("2025-06-15"),
      },
      {
        content: "The Composition API is a game changer. Love using it with Pinia.",
        author: user2._id,
        post: post4._id,
        createdAt: new Date("2025-06-16"),
      },
      {
        content: "Embedding vs referencing is always a tough decision. Nice tips!",
        author: user1._id,
        post: post5._id,
        createdAt: new Date("2025-06-17"),
      },
    ]);

    console.log("Comments created (5 comments)");
    console.log("\n--- Seed complete! ---");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
