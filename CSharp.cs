using System;

namespace CSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string txt = "abcdefghijklmnopqrstuvwxyz";
                 int x = 20;
                int y = 18;
            Console.Write("Enter your name:");
            string name = Console.ReadLine();
            Console.WriteLine("Hello, " + name + "!");
            Console.Write("Enter your Age: ");
            int age = int.Parse(Console.ReadLine());
            Console.WriteLine("Youre age is " + age + " years old.");
            Console.Writeline("Length of the txt: " + txt.Length);
            
          
      if (x > y)
      {
        Console.WriteLine("x is greater than y");
      }else {
          Console.WriteLine("Error!");
      }
        }
    }
}