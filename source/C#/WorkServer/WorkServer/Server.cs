﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Net;
using System.Net.Sockets;

namespace WorkServer
{
    class Server : Socket
    {
        private static IList<Client> list = new List<Client>();
        public event Action<Client> Acception;

        public Server(int port)
            : base(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.IP)
        {
            Bind(new IPEndPoint(IPAddress.Any, port));
            Listen(20);
        }
        public static implicit operator Server(int port)
        {
            return new Server(port);
        }
        public void ServerStart()
        {
            ThreadPool.QueueUserWorkItem((c) =>
            {
                while (true)
                {
                    Client client = Accept();
                    Add(client.SetServer(this));
                    Acception(client);
                }
            });
        }
        public void Add(Client client)
        {
            list.Add(client);
            Console.WriteLine("Connection count - "+list.Count);
        }
        public void Remove(Client client)
        {
            list.Remove(client);
            Console.WriteLine("Connection count - " + list.Count);
        }
        public IList<Client> ClientList
        {
            get { return list; }
        }
    }
}
