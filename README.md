Így futtasd: 
1. hozd létra a projekt2425 nevű adatbázist mysql-ben
2. írd be hogy `npm i` és várd meg amíg letöltődnek a package-k
3. a cmd-be írd be hogy `cd ./prisma`
4. utána ezt a parancsot hogy legeneráld a prisma klienst és létrehozd az adatbázist: `npx prisma migrate dev`
5. utána írd be hogy `cd ..`
6. Hozd létre ezeket a mappákat: /public/user, /public/event/covers, /public/event/gallery
7. Majd futtasd a szervert ezzel a paranccsal: `node index.js`
8. A /tools/database_init_depracated.sql végén van egy insert megírva "Admin" felhasználó névvel, ezt futtasd le (a jelszó: Admin123)
