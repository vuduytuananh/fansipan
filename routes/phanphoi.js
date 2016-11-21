var express = require('express');
var router = express.Router();

/* GET gioi thieu page. */
router.get('/', function(req, res, next) {
  res.render('phanphoi');
});
router.get('/test', function(req, res, next) {
  res.render('phanphoi_template',{province:"TEST"});
});
router.get('/hanoi', function(req, res, next) {
  res.render('phanphoi_hanoi');
});
router.get('/danang', function(req, res, next) {
  res.render('phanphoi_danang');
});
router.get('/langson', function(req, res, next) {
  res.render('phanphoi_langson');
});
router.get('/hcm', function(req, res, next) {
  res.render('phanphoi_hcm');
});
router.get('/haiduong', function(req, res, next) {
  res.render('phanphoi_haiduong');
});
router.get('/hungyen', function(req, res, next) {
  res.render('phanphoi_hungyen');
});
router.get('/haiphong', function(req, res, next) {
  res.render('phanphoi_haiphong');
});
router.get('/quangninh', function(req, res, next) {
  res.render('phanphoi_quangninh');
});
router.get('/hanam', function(req, res, next) {
  res.render('phanphoi_hanam');
});
router.get('/hatinh', function(req, res, next) {
  res.render('phanphoi_hatinh');
});
router.get('/bacninh', function(req, res, next) {
  res.render('phanphoi_bacninh');
});
router.get('/thaibinh', function(req, res, next) {
  res.render('phanphoi_thaibinh');
});
router.get('/bacgiang', function(req, res, next) {
  res.render('phanphoi_bacgiang');
});
router.get('/vinhphuc', function(req, res, next) {
  res.render('phanphoi_vinhphuc');
});
router.get('/thainguyen', function(req, res, next) {
  res.render('phanphoi_thainguyen');
});
router.get('/phutho', function(req, res, next) {
  res.render('phanphoi_phutho');
});
router.get('/ninhbinh', function(req, res, next) {
  res.render('phanphoi_ninhbinh');
});
router.get('/quangbinh', function(req, res, next) {
  res.render('phanphoi_quangbinh');
});
router.get('/quangnam', function(req, res, next) {
  res.render('phanphoi_quangnam');
});
router.get('/quangngai', function(req, res, next) {
  res.render('phanphoi_quangngai');
});
router.get('/hoabinh', function(req, res, next) {
  res.render('phanphoi_hoabinh');
});
router.get('/thanhhoa', function(req, res, next) {
  res.render('phanphoi_thanhhoa');
});
router.get('/nghean', function(req, res, next) {
  res.render('phanphoi_nghean');
});


module.exports = router;
