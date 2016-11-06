using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DangerousRaceGame
{
    using System.IO;
    using System.Threading;
    using Services;

    public partial class MainForm : Form
    {
        private readonly Dictionary<int, string> _dicePicture = new Dictionary<int, string>()
        {
            {1, "../../Images/1.png"},
            {2, "../../Images/2.png"},
            {3, "../../Images/3.png"},
            {4, "../../Images/4.png"},
            {5, "../../Images/5.png"},
            {6, "../../Images/6.png"}
        };

        private int _dice1Value;
        private int _dice2Value;
        public MainForm()
        {
            InitializeComponent();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            pictureBox1.Image = Image.FromFile(_dicePicture[1]);
            pictureBox2.Image = Image.FromFile(_dicePicture[1]);
        }

        private async void btnRollDice_Click(object sender, EventArgs e)
        {
            Reset();
            await Delay();

            lblDice1.Text = _dice1Value.ToString();
            lblDice2.Text = _dice2Value.ToString();
            lblTotal.Text = (_dice1Value + _dice2Value).ToString();
        }

        private async Task Delay()
        {
            var delayTime = 10;
            var random = new Random();
            var start = DateTime.Now;
            while ((DateTime.Now - start).Seconds <= delayTime)
            {
                _dice1Value = random.Next(1, 7);
                _dice2Value = random.Next(1, 7);
                pictureBox1.Image = Image.FromFile(_dicePicture[_dice1Value]);
                pictureBox2.Image = Image.FromFile(_dicePicture[_dice2Value]);
                await Task.Delay(200);
            }
        }

        private void Reset()
        {
            lblDice1.Text = string.Empty;
            lblDice2.Text = string.Empty;
            lblTotal.Text = string.Empty;
        }
    }
}
