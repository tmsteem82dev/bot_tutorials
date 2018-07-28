var builder = require("botbuilder");
var restify = require("restify");

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log("%s listening to %s", server.name, server.url);
});

var connector = new builder.ChatConnector();

server.post("/api/messages", connector.listen());

var bot = new builder.UniversalBot(connector);
var inMemoryStorage = new builder.MemoryBotStorage();
bot.set("storage", inMemoryStorage);

bot.on("conversationUpdate", function (message) {
  console.log("onConversationUpdate");
  if (message.membersAdded[0].id === message.address.bot.id) {
    var reply = new builder.Message()
      .address(message.address)
      .text("Hello, I'm a bot.");
    bot.send(reply);
  }
});

bot.dialog("/", function (session) {
  switch (session.message.text.toLocaleLowerCase()) {
    case "hello":
      session.beginDialog("/hello");
      break;
    case "how are you?":
      session.beginDialog("/how_are_you");
      break;
    default:
      session.send("Hmmm, what does: '" + session.message.text + "' mean?");
      break;
  }
});

bot.dialog("/hello", [function (session, args, next) {
  session.endConversation("Hi!");
}]);

bot.dialog("/how_are_you", [function (session, args, next) {
  session.endConversation("I am fine, thanks.");
}]);