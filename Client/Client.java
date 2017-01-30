package Client;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class Client{
    private String name;
    private Socket socket;
    public Client(final String name) {
        this.name = name;
    }

    public void connect(int port) {

        try {
            socket = new Socket("127.0.0.1",port);//"193.70.84.46",port);
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.format("Connected to server %s:%d\n", socket.getLocalAddress(), socket.getPort());

        final Thread outThread = new Thread(() -> {
            System.out.println("Started...");

            PrintWriter out = null;

            try {
                out = new PrintWriter(socket.getOutputStream());
            } catch (IOException e) {
                System.out.println("outThread:");
                e.printStackTrace();
            }
            out.println("/nickname "+this.name);
            out.flush();
            Scanner scanner = new Scanner(System.in);
            while(scanner.hasNext()){
                String message = scanner.nextLine();
                if(message.equalsIgnoreCase("disconnect")){
                    disconnect();
                }
                if (message.charAt(0) == '/') {
                    out.println(message);
                } else {
                    out.println("/message " + message);
                }
                out.flush();
            }
        });
        outThread.start();

        final Thread inThread = new Thread(() -> {
            Scanner in = null;

            try {
                in = new Scanner(socket.getInputStream());
                while(in.hasNext()){
                        String line = in.nextLine();
                        System.out.println(line);
                }
            } catch (IOException e) {
                System.out.println("inThread: " + e.getMessage());
                //e.printStackTrace();
            }
        });
        inThread.start();
    }

    public void disconnect() {
        try {
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
