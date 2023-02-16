# ETH Rooms Tool

Application to view free Rooms at ETH Zürich

hosted at https://eth.benarmstro.ng<br>
accessible via http://u.ethz.ch/uFbaA (Not sure if i'm allowed to redirect from my eth-page to the www so it's a link for now)

The official <a href="http://www.rauminfo.ethz.ch/IndexPre.do">Rauminfo</a>
site isn't great so I built a new one. This tool shows you all currently available rooms at ETH.
If you have any suggestions for improvements or questions send me an email. Feel free to fork the code and add features 👾.

## TODO

-   update docker-compose file so it is easy to run locally on any machine
-   'add to home-screen' popup/message if on IOS/Android
-   filter by proximity to current location
-   add filters especially for room_type
-   reporting rooms (locked, damaged equipment etc...)

---

### Start frontend locally:

```{bash}
cd frontend; npm run dev
```

### Start backend locally:

```{bash}
cd api; npm run dev
```

---

created by Benedict Armstrong, 2022
