var list = {
  bus_data: {
    thead: [
      "Vendor",
      "From",
      "To",
      "Stops",
      "Timings",
      "Route",
      "Depo",
      "Actions",
    ],
    editForm: [
      `<label for="">From</label>
      <select
        name=""
        class="dropdown"
        data-id="from"
        data-type="stops"
      ><option value="fsd">Select stop</option></select>
      <label for="">To</label>
      <select name="" class="dropdown" data-id="to" data-type="stops">
        <option value="fsd">Select stop</option>
      </select>

      <label for="">Timings</label>
      <input
        type="text"
        name=""
        id="timing"
        placeholder="from time, to time"
      />

      <label for="">Stopages</label>
      <div class="stops-handler-main">
        <div class="shssi">
          <button>Add New stopages</button>
        </div>

        <!-- stops handler search data -->
        <div class="shsd-main dropdownlists">
          <!-- <div class="shsd-every">
            <div class="shsde-name">
              Name:- <span>Jaipur</span>
            </div><br>
            <div class="shsde-at">
              Arrive:- <span>10:00Am</span>
            </div><br>
            <div class="shsde-dt">
              Departure:- <span>10:05Am</span>
            </div><br>
            <div class="actions-shsde">
              <span class="icon"><i class="yhgi yhgi-pencil-24"></i></span>
              <span class="icon remove"><i class="yhgi yhgi-trash-24"></i></span>
            </div>
          </div> -->
        </div>
      </div>

      <label for="">Vendor</label>
      <input type="text" id="vendor" />

      <label for="">Depo</label>
      <input type="text" id="depo" />

      <label for="">Route</label>
      <input type="text" id="route" />
      

      <label for="">bus type</label>
      <input type="text" id="bus-type" />`,
    ],
  },
  cities: {
    thead: ["Stop Name", "Code", "Actions"],
    editForm: [
      `<label for="">City Name</label>
          <input type="text" id="cityname">

          <label for="">City code</label>
          <input type="text" name="" id="citycode">`,
    ],
  },
};

