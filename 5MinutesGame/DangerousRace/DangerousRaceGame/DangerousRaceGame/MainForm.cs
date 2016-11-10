using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Linq;

namespace DangerousRaceGame
{
    using Forms;

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

        private Dictionary<string, int> _turns = new Dictionary<string, int>()
        {
            {"A", 0},
            {"B", 0}
        };

        private readonly List<Label> _questionsForTeamA;
        private readonly List<Label> _questionsForTeamB;

        private int _dice1Value;
        private int _dice2Value;

        private bool isTurnOfTeamA = false;

        public MainForm()
        {
            InitializeComponent();
            _questionsForTeamA = InitQuestions("A");
            _questionsForTeamB = InitQuestions("B");
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            pictureBox1.Image = Image.FromFile(_dicePicture[1]);
            pictureBox2.Image = Image.FromFile(_dicePicture[1]);
            panel2.Controls.AddRange(_questionsForTeamA.ToArray());
            panel3.Controls.AddRange(_questionsForTeamB.ToArray());
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

        private List<Label> InitQuestions(string teamName)
        {
            var questions = new List<Label>();
            int x = 90, y = 20;

            for (int i = 1; i <= 11; i++)
            {
                var location = new Point(x * i, y);
                var question = new Label
                {
                    BackColor = Color.FromArgb(255, 255, 192),
                    ForeColor = Color.Black,
                    BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle,
                    Name = teamName + i.ToString(),
                    Size = new System.Drawing.Size(67, 45),
                    Text = i.ToString(),
                    TextAlign = System.Drawing.ContentAlignment.MiddleCenter,
                    Cursor = Cursors.Hand,
                    Location = location
                };
                question.Click += label_Click;
                question.DoubleClick += label_DoubleClick;

                if (i == 11)
                {
                    question.Location = new Point(x * (i - 1), y + 70);
                }

                questions.Add(question);
            }

            int index = 1;
            for (int i = 21; i >= 12; i--)
            {
                var location = new Point(x * index, y + 140);
                var question = new Label
                {
                    BackColor = Color.FromArgb(255, 255, 192),
                    ForeColor = Color.Black,
                    BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle,
                    Name = teamName + i.ToString(),
                    Size = new System.Drawing.Size(67, 45),
                    Text = i.ToString(),
                    TextAlign = System.Drawing.ContentAlignment.MiddleCenter,
                    Cursor = Cursors.Hand,
                    Location = location
                };

                question.Click += label_Click;
                question.DoubleClick += label_DoubleClick;

                questions.Add(question);
                index++;
            }

            return questions;
        }

        private void label_Click(object sender, EventArgs e)
        {
            Label clickedLabel = sender as Label;

            if (clickedLabel != null)
            {
                isTurnOfTeamA = _questionsForTeamA.Any(p => p.Name == clickedLabel.Name);
                Label currentStep = null;

                currentStep = isTurnOfTeamA
                    ? _questionsForTeamA.Find(p => p.BackColor == Color.DarkOliveGreen)
                    : _questionsForTeamB.Find(p => p.BackColor == Color.DarkOliveGreen);

                if (currentStep != null)
                {
                    currentStep.BackColor = Color.FromArgb(255, 255, 192);
                    currentStep.ForeColor = Color.Black;
                }

                clickedLabel.ForeColor = Color.White;
                clickedLabel.BackColor = Color.DarkOliveGreen;
            }
        }

        private void label_DoubleClick(object sender, EventArgs e)
        {
            Label clickedLabel = sender as Label;

            if (clickedLabel != null)
            {
                var pattern = "{0}_{1}.txt";
                var roundNumber = string.Empty;
                string fileName;

                if (isTurnOfTeamA)
                {
                    _turns["A"]++;
                    fileName = string.Format(pattern, "A", _turns["A"]);
                }
                else
                {
                    _turns["B"]++;
                    fileName = string.Format(pattern, "B", _turns["B"]);
                }

                var questionForm = new Question(fileName);
                questionForm.ShowDialog();
            }
        }
    }
}