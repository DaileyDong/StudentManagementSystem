var Post=require('../model/Post');

module.exports =function (app) {
    //首页
    app.get('/',function (req,res) {
        var page=parseInt(req.query.page)||1;
     Post.get(page,function (err,docs,total) {
       if(err){
           req.flash('error',err);
           return res.redirect('/');
       }
       return  res.render('index',{
           title:'首页',
           page:page,
           isFirstPage:(page-1)*7==0,
           isLastPage:(page-1)*7+docs.length==total,
           success:req.flash('success').toString(),
           error:req.flash('error').toString(),
           docs:docs
       })
   })
 })
   //添加
    app.get('/add',function (req,res) {
        res.render('add',{
            title:'添加学生信息',
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    app.post('/add',function (req,res) {
        var newSave=new Post(req.body.name,req.body.sex,req.body.age,req.body.studentID,req.body.profession,req.body.interest,req.body.date);
         Post.findID(req.body.studentID,function(err,user){
             if(err){
                 req.flash('error',err);
                 return  res.redirect('/add');
             }
             if(user){
                req.flash('error','学号已经被使用！');
                return  res.redirect('/add');
             }
             if(!user){
                 newSave.save(function(err){
                     if(err){
                         req.flash('error','添加失败！');
                         return res.redirect('/');
                     }
                     req.flash('success','添加成功!');
                     return res.redirect('/');
                 })
             }
         })
    })
   //更多
    app.get('/more',function (req,res) {
        res.render('more',{
            title:'学生详细信息'
        })
    })
    //编辑页获取信息
    app.get('/edit/:studentID',function (req,res) {
     Post.getEdit(req.params.studentID,function (err,doc) {
        if(err){
            return res.redirect('/');
        }
       return res.render('edit',{
            title:'编辑学生信息',
           success:req.flash('success').toString(),
           error:req.flash('error').toString(),
            doc:doc
        })
    })
    })
    //编辑信息
    app.post('/edit/:studentID',function (req,res) {
        var studentID=req.params.studentID;
        var student=req.body;
        var query={
            name:student.name,
            sex:student.sex,
            age:student.age,
            profession:student.profession,
            goSchoolDate:student.goSchoolDate,
            interest:student.interest};
        Post.update(studentID,query,function (err) {
            if(err){
                req.flash('error','编辑失败！');
                return res.redirect('/');
            }
            req.flash('success','编辑成功！');
            return res.redirect('/');
        })
    })
    //删除
    app.get('/remove/:name/:sex/:studentID',function (req,res) {
        Post.remove(req.params.name,req.params.sex,req.params.studentID,function (err) {
            if(err){
                return res.redirect('/');
            }
            return res.redirect('/');
        })
    })
   //批量删除
    app.post('/removeAll',function (req,res) {
         var data=req.body['name[]'];
          Post.removeAll(data,function (err) {
             if(err){
                 req.flash('error','删除失败！');
                 return  res.json({code:201,message:'失败'});
             }
            return  res.json({code:200,message:'成功'})
         })
    })
    //搜索
    app.get('/search',function (req,res) {
        Post.search(req.query.keyword,function (err,docs) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            if(docs==""){
                req.flash('error',"没有" +req.query.keyword+ "同学的信息！");
                return res.redirect('/');
            }
            return res.render('search',{
                title:'搜索',
                docs:docs,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
            })
        })
    })


}
