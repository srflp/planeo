# planeo

Narzędzie, które pozwala dodać Twój plan zajęć do Kalendarza Google szybciej i prościej, niż gdyby robić to ręcznie.

Możesz przetestować je [tutaj](https://srflp.github.io/planeo/).

Formularz jest dostosowany obecnie do planów zajęć Wydziału Intformatyki i Telekomunikacji Politechniki Poznańskiej.

_Read this in other languages: [English](README.md)_

## O projekcie

Głównym celem tego projektu jest ułatwienie studentom dodawania swoich planów do Kalendarza Google.

### Dlaczego nie dodawać planu ręcznie?

planeo znacząco upraszcza proces dodawania planu do Kalendarza, robienie tego ręcznie jest bardzo czasochłonne.

### Co ten program tak właściwie robi?

Po wypełnieniu formularza i wysłaniu go, planeo przetwarza wpisane dane i przekazuje je do API Kalendarza Google.
To tak w bardzo dużym uproszczeniu. W rzeczywistości, proces po kliknięciu „Dodaj” wygląda tak:
- dodawane są całodniowe wydarzenia znakujące początki i końce semestru
- w poniedziałek każdego tygodnia semestru dodawane jest całodniowe wydarzenie oznaczające, czy dany tydzień jest tygodniem parzystym, czy nieparzystym (na podstawie informacji z formularza, czy pierwszy tydzień jest parzysty/nieparzysty)
- wyszukiwana jest pierwsza data wystąpienia danego zajęcia w semestrze (uwzględniając parzystości tygodni i występujące święta, podczas których zajęć nie ma), a następnie dodawane jest cykliczne wydarzenie (ang. recurrent event) z tą datą jako datą początku, oraz datą końca semestru jako datę końca cyklicznego wydarzenia. Cykliczne wydarzenia mają częstotliwość określoną na 1 tydzień (przy ustawieniu "wszystkie tygodnie") lub 2 tygodnie (przy wybraniu opcji "parzyste"/"nieparzyste"). Do informacji o cykliczności wydarzenia dołączane są wyjątki, czyli wszystkie daty w których zajęcia się nie odbędą (święta).
- jako całodniowe wydarzenia dodawane są dni wolne od zajęć dydaktycznych (święta) 

## Detale techniczne
Cały projekt został napisany w czystym JavaScripcie, bez użycia żadnych dużych JSowych frameworków.

### Zależności
#### Development side
- [babel](https://github.com/babel/babel) - transpiluje JSa w standardzie ES6 do standardu ES5 który jest obsługiwany przez zdecydowaną większość przeglądarek
- [webpack](https://github.com/webpack/webpack) - uruchamia babela i bundluje kod w pojedynczy plik bundle.js

#### Production side
- [Bootstrap](https://github.com/twbs/bootstrap) - interfejs użytkownika (sam CSS)
- [flatpickr](https://github.com/flatpickr/flatpickr) - kalendarzyki do wyboru daty
- [loadjs](https://github.com/muicss/loadjs) - do wczytywania Google API Client Library bezpośrednio z poziomu JavaScriptu
- [dayjs](https://github.com/iamkun/dayjs) - lekka biblioteka do wygodnego operowania na datach

## Instalacja
Jeśli chcesz uruchomić ten projekt na swoim komputerze:
1. sklonuj repozytorium
2. uruchom `npm install` będąc w katalogu projekty
3. wejdź do folderu `dist` i uruchom z jego poziomu serwer HTTP, np.
    ```
    $ python3 -m http.server 8000
    ```
4. uruchom webpacka:
    ```
    npx webpack
    ```
    Automatycznie będzie on nadzorował zmiany w projekcie i auktualizował plik bundle.js z każdą zmianą.
    
### Inne
Dodatkowo możesz nadać lokalnemu adresowi strony adres publiczny używając ngroka (aby np. przetestować apkę na telefonie):
```
./ngrok http localhost:8000
```
Aktualizacja brancha gh-pages:
```
git subtree push --prefix dist origin gh-pages
```