class BasicController {
  constructor(app, url, dao){
    this.app = app;
    this.url = url;
    this.dao = dao;
  }

  getAll(){
    this.app.get(`/api/${this.url}`, (req, res) => {
      try {
        this.dao.getAll((list) => {
          res.status(200).send(list);
        })
      } catch(error) {
        throw new Error(error);
      }
    });
  }

  getById(){
    this.app.get(`/api/${this.url}/:id`, (req, res) => {
      const id = req.params.id;
      try {
        this.dao.getById(id, (object) => {
          if(!!object){
            res.status(200).send(object);
          } else {
            res.status(404).send({message: `${this.url} with id ${id} not found`})
          }
        })
      } catch(error){
        throw new Error(error);
      }
    });
  }

  beforeSaveOrUpdate({req, res, ...props}){
      return req.body;
  }

  insert(){
    this.app.post(`/api/${this.url}`, (req, res) => {
      const object = this.beforeSaveOrUpdate({req, res});
      //try {
        this.dao.insert(object, (response) => {
          res.status(201).send({message: "Create successfully"});
        })
      //} catch(error){
      //  throw new Error(error);
      //}
    });
  }

  update(){
    this.app.put(`/api/${this.url}/:id`, (req, res) => {
      const id = req.params.id;
      const object = this.beforeSaveOrUpdate({req, res, id});
      try {
        this.dao.update(id, object, (object) => {
          res.status(204).send({message: "Update successfully"});
        })
      } catch(error){
        throw new Error(error);
      }
    });
  }

  deleteFn(){
    this.app.delete(`/api/${this.url}/:id`, (req, res) => {
      const id = req.params.id;
      try {
        this.dao.delete(id, (cbRes) => {
          res.status(200).send({message: "Delete successfully"});
        })
      } catch(error){
        throw new Error(error);
      }
    });
  }

  initializeCRUD(){
    this.getAll();
    this.getById();
    this.insert();
    this.update();
    this.deleteFn();
  }

  initialize(){
    this.initializeCRUD();
  }
}

module.exports = BasicController;
