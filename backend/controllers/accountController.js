// In controllers/accountController.js
exports.createAccount = (req, res) => {
  const { firstName, lastName, email, contact, dob, profession, password } = req.body;
  const profilePic = req.file ? req.file.path : null; // Save file path

  // Save the user data to the database (MongoDB)
  const newUser = new User({
    firstName,
    lastName,
    email,
    contact,
    dob,
    profession,
    password,
    profilePic,
  });

  newUser.save()
    .then(() => {
      res.status(201).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};
