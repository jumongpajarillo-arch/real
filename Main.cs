Using System;

namespace MyApplication
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Enter your name:");
            string name = Console.ReadLine();
            Console.WriteLine("Hello, " + name + "!");
            Console.WriteLine(" Enter your Age: ");
            int age = int.Parse(Console.ReadLine());
            Console.WriteLine("Youre age is " + age + " years old.");
        }
    }
}