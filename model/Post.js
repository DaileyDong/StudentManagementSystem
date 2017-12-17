var mongodb=require('./db');
function Post(name,sex,age,studentID,profession,interest,goSchoolDate) {
    this.name=name;
    this.sex=sex;
    this.age=age;
    this.studentID=studentID;
    //获取下拉菜单选中值
    this.profession=profession;
    this.interest=interest;
    this.goSchoolDate=goSchoolDate
}
//添加
Post.prototype.save=function (callback) {
    //收集数据
    var newQuery={
        name:this.name,
        sex:this.sex,
        age:this.age,
        studentID:this.studentID,
        profession:this.profession,
        interest:this.interest,
        goSchoolDate:this.goSchoolDate
    }
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('students',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(newQuery,function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
//查找所有学生信息
Post.get=function (page,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('students',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //获取信息总条数
            collection.count({},function (err,total) {
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                collection.find({},{limit:7,skip:(page-1)*7}).sort({studentID:1}).toArray(function (err,docs) {
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    return callback(null,docs,total);
                })
            })

        })
    })
}
//编辑显示
Post.getEdit=function (studentID,callback) {
    var editQuery={
        studentID:studentID
    }
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('students',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne(editQuery,function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
//新编辑
Post.update=function (studentID,query, callback) {
    var newQuery={
        name:query.name,
        sex:query.sex,
        age:query.age,
        goSchoolDate:query.goSchoolDate,
        profession:query.profession,
        interest:query.interest
    }
    console.log(newQuery);
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('students',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({studentID:studentID},{$set:newQuery},function (err) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}
//删除单个
Post.remove=function (name,sex,studentID,callback) {
    var removeQuery={
        name:name,
        sex:sex,
        studentID:studentID
    }
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('students',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove(removeQuery,function (err) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}
//批量删除
Post.removeAll=function (data,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('students',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
                collection.remove({studentID:data},function (err) {
                    if(err){
                        return callback(err);
                    }
                    return callback(null);
                })
            })
        })}

//根据姓名查询
Post.search=function (keyword,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('students',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var newRegex=new RegExp(keyword,"i");
            collection.find({name:newRegex}).toArray(function (err,docs) {
                if(err){
                    return callback(err);
                }
                return callback(null,docs);
            }
            )
        })
    })
}
//根据学号查询
Post.findID=function(studentID,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('students',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({studentID:studentID},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,user);
            })
        })
    })
}
module.exports=Post;