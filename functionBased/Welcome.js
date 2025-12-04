function Welcome() {
  if (name == "Not Entered") {
    SpeechSynthesisUtterance("Welcome to the numbers game.");
    name = Listen("What is your name?");
  } else {
    SpeechSynthesisUtterance("Welcome back to the numbers game " + name + ".");
  }
}
