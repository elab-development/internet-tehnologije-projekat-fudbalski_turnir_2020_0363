# Kloniranje projekta i neophodne postavke
 
- Klonirati repozitorijum komandom git clone https://github.com/elab-development/internet-tehnologije-projekat-fudbalski_turnir_2020_0363.git na željenu destinaciju na vašem računaru
- Preuzeti npm sa sledećeg linka https://nodejs.org/en/download
- Pokrenuti Mongo i Apache servere (korišćenjem XAMPP-a)
- U željenom tekstualnom editoru otvoriti klonirani projekat (preporuka VSCode)
 
# Pokretanje Laravel API-ja
 
- Pozicionirati se u iteh-back folder komandom `cd iteh-back`
- Instalirati composer komandom `composer install`
- Kreirati .env fajl u root-u iteh-back projekta i podesiti informacije o konekciji sa bazom: DB_PORT, DB_USERNAME, DB_PASSWORD, DB_HOST
- Popuniti bazu podacima komandom `php artisan db:seed`
- Pokrenuti aplikaciju komandom `php artisan serve`
 
# Pokretanje React aplikacije
 
- Pozicionirati se u iteh-front folder komandom `cd iteh-front` (Neophodno je prvo pozicionirati se u root direktorijum komandom `cd ..`)
- Komandom `npm install` ( ili `npm i`), instalirati neophodne pakete za pokretanje same aplikacije
- Pokrenuti aplikaciju komandom `npm start`
