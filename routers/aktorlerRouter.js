const router = require('express').Router();
const actorsData = require('../data/actors.js');

//aktörleri döndür
router.get('/', (req, res) => {
    const { name, gender } = req.query;

    // Aktörleri filtreleyen yardımcı fonksiyon
    const filterActors = (actors, filters) => {
        return actors.filter(actor => {
            let matches = true;

            // İsim filtresi
            if (filters.name) {
                matches = matches && (actor.isim.toLowerCase().includes(filters.name.toLowerCase()) || (actor.filmler.some(film => film.name.toLowerCase().includes(name.toLowerCase()))));
            }

            // Cinsiyet filtresi
            if (filters.gender) {
                matches = matches && actor.gender?.toLowerCase() === filters.gender.toLowerCase();
            }

            return matches;
        });
    };

    // Filtreleri uygula
    const filteredActors = filterActors(actorsData, { name, gender });

    // Sonucu döndür
    res.status(200).json({
        totalCount: filteredActors.length,
        datas: filteredActors
    });
});

//aktör detay döndür
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const aktor = actorsData.find(aktor => aktor.id === parseInt(id));

    if (aktor) {
        res.status(200).json(aktor)
    }
    else {
        res.status(404).json({ error: "Aradığınız aktor bulunamadı" })
    }
});

//aktör ekle
router.post('/add', (req, res) => {
    const newData = req.body;


    if (!newData.name || !newData.name) {
        return res.status(400).json({ message: 'Eksik veri: name ve surname gerekli' });
    }

    const uniqId = actorsData.reduce((max, actor) => {
        return actor.id > max.id ? actor : max;
    }, actorsData[0]).id + 1;


    const willAddData = {
        id: uniqId,
        ...newData,
        filmler: []
    }

    // Veriyi saklama alanına ekle
    actorsData.push(willAddData);

    // Cevap döndür
    res.status(201).json({ message: 'Veri başarıyla eklendi', data: willAddData });
});

//aktöre film ekle
router.post('/add-movie/:id', (req, res) => {
    const newData = req.body;
    const actorId = req.params.id;

    const actor = actorsData.find(item => item.id == actorId)

    if (!actor) {
        return res.status(400).json({ message: 'Aktor bulunamadı' })
    }

    if (!newData.movieName) {
        return res.status(400).json({ message: 'Eksik veri: movieName  gerekli' });
    }

    const uniqId = actor?.filmler?.reduce((max, film) => {
        return film?.id > max?.id ? film : max;
    }, actor?.filmler[0])?.id + 1;

    actor.filmler.push({
        id: actor?.filmler?.length == 0 ? 1 : uniqId,
        ...newData
    });

    // Cevap döndür
    res.status(201).json({ message: 'Veri başarıyla eklendi', data: actor });
});

module.exports = router;