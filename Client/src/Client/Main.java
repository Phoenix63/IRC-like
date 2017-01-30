package Client;

import java.util.Scanner;

public class Main {

    public static void main(String argv[]){
        final Scanner in = new Scanner(System.in);
        System.out.print("Username: ");
        final String username = in.nextLine();
        Client client = new Client(username);
        client.connect(8088);
    }

}
