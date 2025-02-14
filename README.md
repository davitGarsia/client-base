# კლიენტების ცნობარი

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

აპლიკაციაში შესვლისას იტვირთება კლიენტების სია. ამ სიიდან შესაძლებელია ახალი კლიენტის დამატება, არსებული კლიენტის მონაცემების რედაქტირება ან წაშლა.

კლიენტის დამატების ფორმის ყველა ველს აქვს შესაბამისი ვალიდაცია. კლიენტის ნომრის ველს ადევს ასინქრონული ვალიდატორი უნიკალურობის შესამოწმებლად(მოქმედებას იწყებს მინიმუმ 5 სიმბოლოს ჩაწერისას).
პირად ნომერს ასევე ადევს უნიკალურობის შესამოწმებელი ვალიდატორი.

აპლიკაცია მოიცავს სორტირებასა და ფილტრაციას. შესაძლებელია როგორც გლობალური ფილტრაცია, რომელიც ერთდროულად ყველა ველს მოიცავს, ასევე თითოეული ველის მიხედვით ცალკეული ფილტრაციის განხორციელება. ფილტრაციის ასევე სორტირების პარამეტრები და გვერდის ინფორმაცია(pagination data) ინახება URL-ბარში, რაც მომხმარებელს საშუალებას აძლევს, მარტივად გააზიაროს კონკრეტული ძიების შედეგები ან დაბრუნდეს იმავე სთეითზე რეფრეშის შემდეგ.

კლიენტების სიაში კონკრეტულ მომხმარებელზე დაჭერით, გადავდივართ მისი დეტალური მონაცემების გვერდზე. აქ ვიღებთ სრულ ინფორმაციას კლიენტზე, მათ შორის მის ანგარიშებზე. გვაქვს შესაძლებლობა ანგარიშების რედაქტირებისა და დახურვის.

თითოეული ოპერაციის შემდეგ გამოდის მესიჯი სტატუსის შესაბამისად.

აპლიკაციa სთეით მენეჯმენტისთვის იყენებს NgRx ბიბლიოთეკას. ვიზუალური ელემენტებისთვის გამოყენებულია primeng.

ბექენდად ვიყენებთ JSON Server-ს, რომელიც მონაცემებს ინახავს db.json ფაილში. ეს ფაილი პროექტის ფოლდერშია მოთავსებული, ხოლო სერვერის გაშვება შესაძლებელია შემდეგი ბრძანებით:

 npm run start-json-server


