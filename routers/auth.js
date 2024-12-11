const router = require('express').Router();
const usersData = require('../data/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//aktörleri döndür
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Eksik veri: username veya password gerekli' });
    }

    const user = usersData.find(item => item.username == username)

    if (user && (username == user.username && await bcrypt.compare(password, user.password))) {

        // JWT Token oluşturma
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            'tevfik', // Bu gizli anahtar uygulamanın kendine özel olmalı
            { expiresIn: '1h' } // Token'ın geçerlilik süresi
        );

        res.status(200).json(
            {
                message: "giriş başarılı",
                token: token
            }
        )
    }
    else {
        res.status(200).json(
            {
                message: "giriş başarısız"
            }
        )
    }
});

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Eksik veri: username, password ve email gerekli' });
    }

    // Kullanıcı adı kontrolü
    const userExists = usersData.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Bu kullanıcı adı zaten mevcut.' });
    }

    // Şifreyi hash'leme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı verisini oluşturma
    const newUser = {
        id: usersData.length + 1,
        username,
        password: hashedPassword,
        email: email
    };

    // Kullanıcıyı veritabanına (ya da sabit listeye) kaydetme
    usersData.push(newUser);

    // Kullanıcı başarıyla oluşturuldu
    res.status(201).json({
        message: 'Kullanıcı başarıyla oluşturuldu.',
        user: { id: newUser.id, username: newUser.username }
    });
});

module.exports = router;