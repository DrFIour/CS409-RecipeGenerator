var secrets = require('../config/secrets');
const User = require('../models/user');
const { get_recommended_meal } = require("../helpers/gpt");

module.exports = function (router) {

    var homeRoute = router.route('/');

    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    router.get('/users', async (req, res) => {
        try {

            const users = await User.find();

            res.status(200).json({message: "OK", data: users});
        } catch (err) {
            console.log("users/get: " + err.message)
            res.status(500).json({ message: err.message });
        }
    });




    router.post('/users', async (req, res) => {
        const user = new User({
            userName: req.body.userName || req.body.email,
            email: req.body.email, 
            password: req.body.password,
            ingredients: req.body.ingredients
        });

        try {
            const newUser = await user.save();
            res.status(201).json({message: 'OK', data: newUser});
        } catch(err) {
            if (err.code === 11000) {
                res.status(409).json({
                    message: "duplicate user"
                })
                return;
            }
            res.status(500).json({message: err.message});
        }
    })

    router.post('/authentication', async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Password not match!'});
            }

            res.status(200).json({message: 'OK',
                data: {
                    _id: user._id, 
                    userName: user.email
                }
            });
        } catch (err) {
            res.status(500).json( {message: err.message })
        }
        
    })

    router.patch('/users/:id', async (req, res) => {
        try {
            const userID = req.params.id;
            const updates = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                userID,
                updates,
                {new: true, runValidators: true}
            );
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' }); 
            }
            res.status(201).json({message: 'OK', data: updatedUser});
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    });

    router.get('/users/:id', async (req, res) => {
        try {
            const userID = req.params.id;
            const user = await User.findById(userID)
            if (!user) {
                return res.status(404).json({ message: 'User not found' }); 
            }
            res.status(200).json({message: 'OK', data: user});
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    })

    router.post('/get_meal/:id', async (req, res) => {
        try {
            const userID = req.params.id;
            const {previousMeals, comment} = req.body;

            const user = await User.findById(userID);
            if (!user) {
                res.status(404).json({ message: 'User not found', data: "" }); 
                return;
            }
            
            const meal_detail = await get_recommended_meal(user.ingredients, previousMeals, comment);
            res.status(200).json({message: 'OK', data: meal_detail});
        } catch(err) {
            res.status(500).json({ message: err, data: "" });
        }
    });

    return router;
}
