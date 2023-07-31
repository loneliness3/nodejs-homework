const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`);
const tours = JSON.parse(data);

exports.checkId = (req, res, next, val) => {
    console.log(`Tour id is ${val}`);

    if(val*1 > tours.length){
        return res.status(404).json({
            status : "fail",
            message : "Invalid ID",
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
   res.status(200).json({
       status: "success",
       requstedAt: req.reqTime,
       result: tours.length,
       data: {
       tours,
       },
   });
};
  
exports.addTour =  (req, res) => {
    console.log(req.body);
    const newid = tours.length;
  
    const newTour = Object.assign(req.body, { id: newid });
    console.log(newTour);
    tours.push(newTour);
  
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        if (err) {
          console.log("Something Wrong");
        } else {
          res.status(201).json({
            status: "sucess",
            data: {
              newTour,
            },
          });
        }
      }
    );
};
  
exports.getOneTour = (req, res) => {
    console.log(req.params);
  
    const id = req.params.id * 1;
  
    const tour = tours.find((item)=> item.id === id);
    
    // if(!tour){
    //     res.status(404).json({
    //         status : "fail",
    //         message : "Invalid Id"
    //     })
    // }
  
    res.status(200).json({
      status: "success",
      data: {
        tour,
      }
    });
};
  
exports.deleteOneTour = (req, res)=>{
    const tour = tours.find(tour =>{
      if(tour.id === req.params.id*1){
        return tour
      }
    })
  
    if(!tour){
      res.status(404).json({
        message : "Tour Not Found"
      })
    }else{
      const tourIndex = tours.indexOf(tour);
      tours.splice(tourIndex, 1);
      fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
          if (err) {
            console.log("Something Wrong");
          } else {
            res.status(204).json({
              status: 204,
              message: "Deleted Successfully!",
            })
          }
        }
      )
    }
};
  
exports.patchOneTour = (req,res)=> {
    res.status(200).json({
      message : "Success",
    })
};
