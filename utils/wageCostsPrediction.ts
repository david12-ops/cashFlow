// function prepareWageCostData(): {};

// function wageCostsPrediction(
//   hoursWorked: number,
//   hourlyRate: number,
//   weeksWorked: number
// ): number {}

/*
 je tu ještě možnost
 toho, že bychom vzali jednotlivé části mezd (zálohy, povinné odvody, mzdy, daň) a zkusili
 pro každou část mzdových výdajů vytvořit samostatný odhad.
*/

/*
 Pro nás ovšem bude důležitější nehierarchická shluková analýza, která hledá různé
 neprázdné podmnožiny s prázdným průnikem.
*/

/*
 Rozhodli jsme se použít metodu k-means, která se snaží minimalizovat celkové sumy
 čtverců vzdáleností uvnitř skupin. Vzdálenost je u této metody Euklidovská. 
*/

/*
 Další nevýhodou je u metody k-meansto, že je velmi citlivá na odlehlápozorování.
 Tuto nevýhodu se budeme snažit minimalizovat tím, že z odhadu vynecháme velmi nízké
 mzdové výdaje, které budou vůči zbylým výdajům zanedbatelné.
*/

// jako hraniční hodnota je vedená 100 000 Kč, mi si ji určíme dle naší simulace/analýzy

/*
 Následně potřebujeme každému shluku přiřadit částku. Abychom se vyvarovali vý
 chylkám v datech, tak si pro každý shluk určíme mediánovou částku ze všech historických
 hodnot daného shluku
*/

/*
 Protože mzdy se měsíc od měsíce příliš neliší,
 použijeme pro současný měsíc celkovou částku z minulého měsíce, tedy z prosince. Ta
 činila-10 934 316 Kč.
*/

/*
 Problémem této metody je to, že neumíme rozlišit, která platba půjde na kterou měnu,
 všechny platby by tedy byly v českých korunách. Dále tu také nejsou zohledněny platby,
 jejichž frekvence je menší než jeden měsíc.
*/

/*
 Medián tedy v tomto případě
 není příliš vhodným nástrojem.Zkusíme použít nástroj, který bere data více jako časovou
 řadu a dává větší váhu na poslední pozorování.Zkusíme již popsanou náhodnou procházku
 sdriftem.
*/
