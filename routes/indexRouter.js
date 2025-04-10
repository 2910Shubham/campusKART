import express from "express";
const router = express.Router();
router.get("/", (req, res) => {
    res.render("index", {
      messages: {
        error: req.flash("error"),
        R_error: req.flash("R_error"),
        R_success: req.flash("R_success")
      }
    });
  });

// router.get('/', function(req, res){
//     res.render('index');
// })

router.get('/list', function(req, res){
    res.render('list-product');
})

router.get('/home', function(req, res){
    res.render('home');
})




export default router;