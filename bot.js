const client = global.client;

client.on("ready", () => {
    console.log("Bot giriş yaptı !");
});

client.login(global.Settings.Token);