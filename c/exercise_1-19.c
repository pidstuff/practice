#include <stdio.h>

#define MAXLINE 1000

int get_line(char line[], int maxline);
void reverse(char line[]);

int main()
{
    /* Exercise 1-19
       Write a function reverse(s) that reverses the character string s.
       Use it to write a program that reverses its input a line at a time.
    */
    printf("Input text (press ctrl+d to end):\n");
    int i;
    char line[MAXLINE];
    
    while (get_line(line, MAXLINE) > 0)
    {
        reverse(line);
	printf("\n");
        for (i=0; line[i] != '\0'; ++i)
            printf("%c", line[i]);
	printf("\n");
    }
    return 0;
}

int get_line(char s[], int lim)
{
    int c, i, m;
    i = m = 0;
    while ((c = getchar()) != EOF && c != '\n')
    {
        if (i < lim - 1)
        {
            s[i] = c;
            ++i;
        }
        ++m;
    }
    s[i] = '\0';
    return m;
}

void reverse(char line[])
{
    char reversed[MAXLINE];
    int i, j, end;
    j = 0;
    end = 0;

    for (i=0; line[i] != '\0'; ++i)
        end = i;
    for (i=end; i>=0 ;--i)
    {
        reversed[j] = line[i];
	++j;
    }
    reversed[j] = '\0';

    for (i=0; reversed[i] != '\0'; ++i)
        line[i] = reversed[i];
}
