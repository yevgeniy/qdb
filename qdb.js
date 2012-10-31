/*

var db = new QDB(defs);
db.set([
  {
    lvl:{gte:4},
    class:['knight', {is:'mage', isSpecial:true}],
    race:'human'
  },
  {
    race:'ork'
  }
]);

console.log(db);
 */

(function(){
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
    
  var QDB=(function(){
    
    function QDB(def){
      this.rows=[];
      
      if (! def){
        console.trace();
        throw "Definition object was not set.";
      }
      this.definition=def;
      this.repository={};
    }
    QDB.prototype.rows=null;
    QDB.prototype.definition=null;
    QDB.prototype.repository=null;
    
    QDB.prototype.create=function(data){
      var row = new Row(data);
      return row;
    }
    QDB.prototype.add=function(row){
      this.rows.push(row);
    }
    QDB.prototype.remove=function(row){
      var index;
      if (row instanceof Row)
        index = this.rows.indexOf(row);
        
      this.rows.splice(index,1);
    }
    QDB.prototype.find=function(){
      console.trace();
      throw 'Not implemented.';
    }
    QDB.prototype.set=function(data){
      var row, subject, pred, test, _this=this, def, args;
      this.add((row=this.create(data)));
      
      row.data.forEach(function(complex){
        for (subject in complex)
          (pred = complex[subject]).forEach(function(conjunct){
            for (test in conjunct)
              if (def=_this.definition[test])
                def.register(subject, (args=conjunct[test]), _this.repository, row);
          });
      });
    }
    
    return QDB;
  })();
  
  var Row=(function(){
    
    function Row(data){
      this.data=this._normalizeQuery(data);
      var res = parseQuery(this.data);
      console.log(res);
      
      function parseQuery(data){
        var mems=[];
        data.forEach(function(complex){
          mems=mems.concat(parseComplex(complex));
        });
        return mems;
      }
      
      function parseComplex(complex){
        var mems=[];
        var i, res;
        for (i in complex){
          res = parsePredicate(complex[i]);
          if (mems.length==0)
            mems=res;
          else {
            var newMems=[];
            for (var x=0; x < res.length; x++)
              for (var y=0; y < mems.length; y++)
                newMems.push( mems[y].concat(res[x]) )
            mems=newMems;
          }
        }
        return mems;
      }
      
      function parsePredicate(predicate){
        var mems=[], i;
        predicate.forEach(function(conjunct){
          mems.push([]);
          for (var i in conjunct){
            mems[mems.length-1].push(i + " -- " + conjunct[i])
          }
        });
        return mems;
      }
    }
    Row.prototype.data=null;
    
    Row.prototype._normalizeQuery=function(query){
      var _this=this;
      
      if (query instanceof Array === false)
        query=[query];
        
      query.map(function(v){
        return _this._normalizeComplex(v);
      });
        
      return query;
    }
    Row.prototype._normalizeConjunct=function(conjunct){
      if (typeof conjunct != 'object') /* Simple value. */
        conjunct = {
          is:[conjunct]
        };
      else{
        var i,o;
        for (i in conjunct)
          if ((o=conjunct[i]) instanceof Array == false)
            conjunct[i] = [o];
      }
      
      return conjunct;
    }
    Row.prototype._normalizePredicate=function(predicate){
      var _this=this
      ;
      if (predicate instanceof Array === false)
        predicate = [predicate];
      
      predicate = predicate.map(function(conjunct){
        return _this._normalizeConjunct(conjunct);
      });
      return predicate;
    }
    Row.prototype._normalizeComplex=function(complex){
      var _i
      ;
      for (_i in complex)
        complex[_i] = this._normalizePredicate(complex[_i]);
        
      return complex;
    }
    
    return Row;
  })();
  
  var DefinitionMember=(function(){
    
    function DefinitionMember(){
      
    }
    
    DefinitionMember.prototype.register=function(subject, args, repository){
      console.trace();
      throw 'Not implemented';
    }
    
    return DefinitionMember;
  })();
  
  var definition={
    eq:(function(){
      __extends(eq, DefinitionMember);
      function eq(){
        
      }
      eq.prototype.register=function(subject,args,repository,row){
        var section, args=args[0], focus, complex;
        if (! (complex = repository.eq))
          complex = (repository.eq = {});
        
        if (! (section = complex[subject]))
          section = (complex[subject] = {});
          
        if (! (focus = section[args]))
          focus = (section[args] = []);
          
        focus.push(row);
      }
      
      return new eq();
    })(),
    gte:(function(){
      __extends(gte, DefinitionMember);
      function gte(){
        
      }
      gte.prototype.register=function(subject,args,repository){
        
      }
      
      return new gte();
    })(),
    lte:(function(){
      __extends(lte, DefinitionMember);
      function lte(){
        
      }
      lte.prototype.register=function(subject,args,repository){
        
      }
      
      return new lte();
    })(),
    isFunction:(function(){
      __extends(isFunction, DefinitionMember);
      function isFunction(){
        
      }
      isFunction.prototype.register=function(subject,args,repository){
        
      }
      
      return new isFunction();
    })()
  }

  module=module||{};
  module.exports={
    QDB:QDB,
    Row:Row,
    DefinitionMember:DefinitionMember,
    definition:definition
  };
  
})();
