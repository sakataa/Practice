namespace DangerousRaceGame.Services
{
    using System;
    using System.Threading.Tasks;

    public class DiceGenerator
    {
        private readonly Random _random;

        public DiceGenerator()
        {
            _random = new Random();
        }

        public async Task<int> GenerateDiceNumber()
        {
            return await Task.FromResult(_random.Next(1, 7));
        }
    }
}